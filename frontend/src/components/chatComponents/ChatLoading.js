import React from 'react'
import {Skeleton} from '@chakra-ui/skeleton';
import {Stack} from '@chakra-ui/layout'
;function ChatLoading() {
  return (
    <Stack>
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
        <Skeleton height='30px' />
    </Stack>
  )
}

export default ChatLoading
