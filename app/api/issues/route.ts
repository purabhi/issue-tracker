import {NextRequest, NextResponse} from 'next/server';
import {prisma} from "@/prisma/client";
import { issueSchema } from '../../validationSchemas';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import { Status } from '@prisma/client';

export async function POST(request :NextRequest){
   const session = await getServerSession(authOptions)

   if(!session)
    return NextResponse.json({},{status : 401})
   const body = await request.json(); 
   const validation = issueSchema.safeParse(body);
   if(!validation.success)
    return NextResponse.json(validation.error.errors,{status : 400})




   const newIssue = await prisma.issue.create({
    data : {
        title :body.title,
        description : body.description
    }
   });
   return NextResponse.json(newIssue,{status : 201 })


}


export async function GET(req: NextRequest) {
  const statusParam = req.nextUrl.searchParams.get('status');

  const status = Object.values(Status).includes(statusParam as Status)
    ? (statusParam as Status)
    : undefined;

  const issues = await prisma.issue.findMany({
    where: status ? { status } : undefined,
  });

  return NextResponse.json(issues);
}