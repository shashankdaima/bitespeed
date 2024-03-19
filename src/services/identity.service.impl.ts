import { PrismaClient } from "@prisma/client";
import { IdentityResponse } from "../models/identity.post.response";
import { Exception, Result, Success } from "../utils/result.util";
import { IdentityService } from "./identity.service";
const prisma = new PrismaClient();
export class IdentityServiceImpl implements IdentityService {
    async identifyUser(email: string, phoneNumber: string): Promise<Result<IdentityResponse>> {

        try{
            await prisma.contact.create({
                data: {
                    linkPrecedence: "primary",
                    email: email,
                    phoneNumber: phoneNumber
                }
            });
        }catch(ignored){
            //ignored because only constaint that is unique is email and phone number
        }
        let mainContact = await prisma.contact.findFirst({
            where: {
                OR: [
                    {
                        email: email
                    },
                    {
                        phoneNumber: phoneNumber
                    }
                ]
            }, orderBy: { createdAt: "asc" }
        });
        if (!mainContact) {
            return new Exception("Main Contact can't be found", 404);

        }
        //existing user
        await prisma.contact.updateMany({
            where: {
                AND: [
                    {
                        OR: [
                            { phoneNumber: { equals: phoneNumber } },
                            { email: { equals: email } }
                        ]
                    },
                    { id: { not: mainContact.id } }
                ]
            },
            data: {
                linkPrecedence: "secondary",
                linkedId: mainContact.id
            }
        });


        // Collect secondary rows
        const secondaryContacts = await prisma.contact.findMany({
            where: { linkPrecedence: "secondary", linkedId: mainContact.id }
        });
        // Collect emails
        let emails: string[] = [];
        let phoneNumbers: string[] = [];
        let secondaryContactIds: number[] = [];
        secondaryContacts.forEach(contact => {
            emails.push(contact.email!);
            phoneNumbers.push(contact.phoneNumber!);
            secondaryContactIds.push(contact.id!);
        });

        return new Success<IdentityResponse>({
            contact: {
                primaryContatctId: mainContact.id,
                emails: emails,
                phoneNumbers: phoneNumbers,
                secondaryContactIds: secondaryContactIds,
            }
        });

    }

}