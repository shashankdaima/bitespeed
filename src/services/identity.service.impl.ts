import { Contact, PrismaClient } from "@prisma/client";
import { IdentityResponse } from "../models/identity.post.response";
import { Exception, Result, Success } from "../utils/result.util";
import { IdentityService } from "./identity.service";
const prisma = new PrismaClient();
export class IdentityServiceImpl implements IdentityService {
    async identifyUser(email: string, phoneNumber: string): Promise<Result<IdentityResponse>> {
        return await prisma.$transaction(async (tx) => {
            try {
                const previousRefs = await tx.contact.count({
                    where: {
                        OR: [
                            { email: email },
                            { phoneNumber: phoneNumber }
                        ]
                    }
                });


                if (previousRefs === 0) {
                    return await createNewCluster();
                }

                const exactMatchFound = await tx.contact.count({
                    where: {
                        email: email,
                        phoneNumber: phoneNumber
                    }
                });
                const possibleClusterMakers = await tx.contact.findFirst({
                    where: {
                        OR: [
                            { email: email },
                            { phoneNumber: phoneNumber }
                        ],
                        contactClusterId: {
                            not: null
                        }
                    },
                    orderBy: {
                        contactCluster: {
                            createdAt: "asc"
                        }
                    },
                    include: {
                        contactCluster: true
                    }
                });
                console.log("possibleClusterMakers", possibleClusterMakers);
                const clusterId = possibleClusterMakers?.contactCluster?.id ?? null;
                console.log("clusterId", clusterId);
                if (exactMatchFound === 0) {
                    await tx.contact.create({
                        data: {
                            email: email,
                            phoneNumber: phoneNumber,
                            contactClusterId: clusterId
                        }
                    })
                    console.log("created new contact");

                }
                const contactsWithOtherClusters = await tx.contact.findMany({
                    where: {
                        OR: [
                            { email: email },
                            { phoneNumber: phoneNumber }
                        ],
                        contactClusterId: {
                            not: clusterId
                        }
                    },

                });
                //till now checked
                for (const contact of contactsWithOtherClusters) {
                    const otherCluster = await tx.contactCluster.findFirst({
                        where: {
                            id: contact.contactClusterId!

                        },
                        include: {
                            members: true
                        }
                    })
                    for (const member of otherCluster!.members) {
                        await tx.contact.update({
                            where: {
                                id: member.id
                            },
                            data: {
                                contactClusterId: clusterId
                            }
                        })
                    }
                    await tx.contactCluster.delete({
                        where: {
                            id: otherCluster!.id
                        }
                    });
                }
                const emails: string[] = [];
                const phoneNumbers: string[] = [];
                const secondaryContactIds: number[] = [];
                const mainCluster = await tx.contactCluster.findFirst({
                    where: {
                        id: clusterId!

                    },
                    include: {
                        members: true
                    }
                })
                for (const member of mainCluster?.members ?? []) {
                    if (member.email) {
                        emails.push(member.email);
                    }
                    if (member.phoneNumber) {
                        phoneNumbers.push(member.phoneNumber);
                    }
                    if (member.id !== mainCluster?.creatorId!) {
                        secondaryContactIds.push(member.id);
                    }
                }
                console.log("emails", emails);
                console.log("phoneNumbers", phoneNumbers);
                console.log("secondaryContactIds", secondaryContactIds);
                const response = ({
                    contact: {
                        primaryContactId: mainCluster?.creatorId!,
                        emails: emails,
                        phoneNumbers: phoneNumbers,
                        secondaryContactIds: secondaryContactIds
                    }
                });
                console.log("response", response);

                return new Success(response);

            } catch (e: Error | any) {
                return new Exception(e?.message ?? "Unknown Error");
            }


            async function createNewCluster() {
                const newContact = await tx.contact.create({
                    data: {
                        email: email,
                        phoneNumber: phoneNumber,
                    }
                });

                const newContactCluster = await tx.contactCluster.create({
                    data: {
                        creatorId: newContact.id
                    }
                });
                await tx.contact.update({
                    where: {
                        id: newContact.id
                    },
                    data: {
                        contactClusterId: newContactCluster.id
                    }
                });

                const response = ({
                    contact: {
                        primaryContactId: newContact.id,
                        emails: [newContact.email!],
                        phoneNumbers: [newContact.phoneNumber!],
                        secondaryContactIds: []
                    }
                });

                return new Success(response);
            }
        });
    }


}
