import { prisma } from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import EditIssueButton from './EditIssueButton'
import IssueDetails from './IssueDetails'

interface Props{
    params:Promise<{id:string}>
}


const IssueDetailPage = async ({params}:Props) => {

     const resolvedParams = await params 

  const id = Number(resolvedParams.id)

  // if id is not a valid number (like NaN)

  if (isNaN(id)) 
{
    notFound();
  }

   

    const issue = await prisma.issue.findUnique({
        where:{id:parseInt(resolvedParams.id)}
    })

    if(!issue)
    {
        notFound();
    }

  return (
    <Grid columns={{initial:"1",md:"2"}} gap="5">
    <Box>
     <IssueDetails issue={issue} />    
  </Box> 
  <Box>
    <EditIssueButton issueId={issue.id}/>
  </Box>     
</Grid>
  )
}

export default IssueDetailPage