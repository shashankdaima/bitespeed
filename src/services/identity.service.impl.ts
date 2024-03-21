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
                        ],
                    }
                });


                if (previousRefs === 0) {
                    return await createNewCluster();
                }
                const possibleClusterMakers = await tx.contact.findMany({
                    where: {
                        OR: [
                            { email: email },
                            { phoneNumber: phoneNumber }
                        ], 
                        contactClusterId:{
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
                const exactMatchFound = await tx.contact.count({
                    where: {
                        email: email,
                        phoneNumber: phoneNumber
                    }
                });
                if (!exactMatchFound) {
                    await tx.contact.create({
                        data: {
                            email: email,
                            phoneNumber: phoneNumber,
                            contactClusterId: null
                        }
                    })
                }
                let clusterId:number|undefined = undefined;
                for (const possibleClusterMaker of possibleClusterMakers) {
                    if(possibleClusterMaker.id==possibleClusterMaker.contactCluster?.creatorId){
                        clusterId=possibleClusterMaker.contactCluster?.id;
                        await tx.contact.updateMany({
                            where:{
                                id: {
                                    not:possibleClusterMaker.id
                                },
                                OR: [
                                    { email: email },
                                    { phoneNumber: phoneNumber }
                                ],
                            },
                            data:{
                                contactClusterId: possibleClusterMaker.contactCluster?.id   
                            }
                        });
                        break;
                    }
                }
                const contactCluster=await tx.contactCluster.findFirst({
                    where: {
                        id: clusterId
                    },
                    include: {
                        members: true
                    }
                });
                const emails: string[] = [];
                const phoneNumbers: string[] = [];
                const secondaryContactIds: number[] = [];
                for (const member of contactCluster?.members??[]) {
                    if (member.email) {
                        emails.push(member.email);
                    }
                    if (member.phoneNumber) {
                        phoneNumbers.push(member.phoneNumber);
                    }
                    if (member.id!==contactCluster?.creatorId ) {
                        secondaryContactIds.push(member.id);
                    }
                }
                const response = ({
                    contact: {
                        primaryContactId: contactCluster!.creatorId,
                        emails: emails,
                        phoneNumbers: phoneNumbers,
                        secondaryContactIds: secondaryContactIds
                    }
                });

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
