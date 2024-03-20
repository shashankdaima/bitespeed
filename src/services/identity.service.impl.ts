import { PrismaClient } from "@prisma/client";
import { IdentityResponse } from "../models/identity.post.response";
import { Exception, Result, Success } from "../utils/result.util";
import { IdentityService } from "./identity.service";
const prisma = new PrismaClient();
export class IdentityServiceImpl implements IdentityService {
                async identifyUser(email: string, phoneNumber: string): Promise<Result<IdentityResponse>> {
        return await prisma.$transaction(async (tx) => {
            try {
                const previousRefs = await tx.contact.findMany({
                    where: {
                        OR: [
                            { email: email },
                            { phoneNumber: phoneNumber }
                        ]
                    },
                    include: {
                        contactCluster: true
                    }
                });


                if (previousRefs.length === 0) {
                    const newContact = await tx.contact.create({
                        data: {
                            email: email,
                            phoneNumber: phoneNumber,
                            linkPrecedence: "primary",
                        }
                    });

                    const newContactCluster = await  tx.contactCluster.create({
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

                    const response:IdentityResponse =({
                        contact: {
                            primaryContactId: newContact.id,
                            emails: [newContact.email!],
                            phoneNumbers: [newContact.phoneNumber!],
                            secondaryContactIds: []
                        }
                    });

                    return new Success(response);

                }
                

                return new Exception("User not found");

            } catch (e: Error | any) {
                return new Exception(e?.message ?? "Unknown Error");
            }
        });
    }


}
