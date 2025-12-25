import React from 'react'
import { Table } from '@radix-ui/themes';
import {prisma} from '@/prisma/client';
import IssueStatusBadge from '../components/IssueStatusBadge';
import delay from 'delay';
import IssueActions from './issueActions';
import { Issue, Status } from '@prisma/client';
import Link from '../components/Link';
import NextLink from 'next/link';
import { ArrowUpIcon } from '@radix-ui/react-icons';



interface Props{
  searchParams :Promise<{status? : Status,orderBy: keyof Issue}>
}


const IssuesPage = async({searchParams}:Props) => {


  const columns :{
    label:string;
    className?:string;
    value: keyof Issue;
  }[]=[
    {label:'Issue',value:'title'},
    {label:'Status',value:'status',className:'hidden md:table-cell'},
    {label:'Created',value:'createdAt',className:'hidden md:table-cell'}

  ]



  const resolvedParams = await searchParams;

  console.log("SEARCH PARAMS", resolvedParams.status);

  const statuses = Object.values(Status);

  const status = statuses.includes(resolvedParams.status!) ?resolvedParams.status:undefined

  const orderBy = columns.map(column=>column.value).includes(resolvedParams.orderBy)?{[resolvedParams.orderBy]:'asc'}:undefined;

  const issues = await prisma.issue.findMany({where:{status:status},orderBy});
  await delay(2000);
  return (
    <div>
      <IssueActions/>
    <Table.Root variant='surface'>
      <Table.Header>
        <Table.Row>
          {columns.map((column)=><Table.ColumnHeaderCell className={column.className} key={column.value}><NextLink href={{
            query:{...resolvedParams,orderBy:column.value}
          }}>{column.label}</NextLink>
          {column.value===resolvedParams.orderBy && <ArrowUpIcon className='inline'/>}
          </Table.ColumnHeaderCell>)}
          
          

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