import React from 'react'
import { Table } from '@radix-ui/themes';
import {prisma} from '@/prisma/client';
import IssueStatusBadge from '../components/IssueStatusBadge';
import delay from 'delay';
import IssueActions from './issueActions';
import Link from '../components/Link';
import { Status } from '@prisma/client';


interface Props{
  searchParams :{status? : Status}
}


const IssuesPage = async({searchParams}:Props) => {


  // console.log(searchParams)

  const resolvedParams = await searchParams;

  console.log("SEARCH PARAMS", resolvedParams.status);

  const statuses = Object.values(Status);

  const status = statuses.includes(resolvedParams.status!) ?resolvedParams.status:undefined

  const issues = await prisma.issue.findMany({where:{status:status}});
  await delay(2000);
  return (
    <div>
      <IssueActions/>
    <Table.Root variant='surface'>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className='hidden md:table-cell'>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className='hidden md:table-cell'>Created</Table.ColumnHeaderCell>

         </Table.Row>
         </Table.Header>
         <Table.Body>
           {issues.map(issue =>(
          <Table.Row key={issue.id}>
          <Table.ColumnHeaderCell>
            
           <Link  href={`/issues/${issue.id}`}>
            {issue.title}
           </Link>
            <div className='block md:hidden'>
           <IssueStatusBadge status={issue.status}/>
            </div>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className='hidden md:table-cell'><IssueStatusBadge status={issue.status}/></Table.ColumnHeaderCell>

          <Table.ColumnHeaderCell className='hidden md:table-cell'>{issue.createdAt.toDateString()}</Table.ColumnHeaderCell>

        </Table.Row>
       ))}
      </Table.Body>
    </Table.Root>
    </div>
  )
}

export const dynamic = 'force-dynamic';

export default IssuesPage