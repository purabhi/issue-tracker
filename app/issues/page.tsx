import React from 'react'
import { Flex, Table } from '@radix-ui/themes';
import {prisma} from '@/prisma/client';
import IssueStatusBadge from '../components/IssueStatusBadge';
import delay from 'delay';
import IssueActions from './issueActions';
import Pagination from '../components/Pagination';
import IssueTable, { columnNames, IssueQuery } from './IssueTable';
import { Status } from '@prisma/client';

interface Props{
  searchParams :Promise<IssueQuery>
}


const IssuesPage = async({searchParams}:Props) => {

  const resolvedParams = await searchParams;
  const statuses = Object.values(Status);

  const status = statuses.includes(resolvedParams.status!) ?resolvedParams.status:undefined

  const orderBy = columnNames.includes(resolvedParams.orderBy)?{[resolvedParams.orderBy]:'asc'}:undefined;

  const where = {status};

  const page = parseInt(resolvedParams.page) || 1;
  const pageSize=10;

  const issues = await prisma.issue.findMany({where,orderBy,
  skip:(page-1)*pageSize,
  take:pageSize
});

const issueCount = await prisma.issue.count({
  where
})

  await delay(2000);
  return (
    <Flex direction="column" gap="3">
    <IssueActions/>
    <IssueTable searchParams={searchParams} issues={issues}/>
    <Pagination
    pageSize={pageSize}
    currentPage={page}
    itemCount={issueCount}
    />
    </Flex>
  )
}

export const dynamic = 'force-dynamic';

export default IssuesPage