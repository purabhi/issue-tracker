import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import Link from '../components/Link'
import React from 'react'
import NextLink from 'next/link';
import { Issue, Status } from '@prisma/client';

import IssueStatusBadge from '../components/IssueStatusBadge'


export interface IssueQuery{
 status? : Status,
    orderBy: keyof Issue,
  page :string   
}

interface Props{
  searchParams :Promise<IssueQuery>
  , issues:Issue[]
}

const IssueTable = async({searchParams,issues}:Props) => {

const resolvedParams = await searchParams;

  return (
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
  )
}

const columns :{
        label:string;
        className?:string;
        value: keyof Issue;
      }[]=[
        {label:'Issue',value:'title'},
        {label:'Status',value:'status',className:'hidden md:table-cell'},
        {label:'Created',value:'createdAt',className:'hidden md:table-cell'}
    
      ]

export const columnNames = columns.map(column=>column.value)


export default IssueTable