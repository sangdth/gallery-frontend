import React from 'react';
import { Flex } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

type RulerProps = {
  value: number;
};

export const Ruler = (props: RulerProps) => {
  const { value } = props;
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="#EFEFEF"
      marginTop="10px"
      marginBottom="10px"
      // _before={{
      //   content: '""',
      //   position: 'absolute',
      //   top: '50%',
      //   left: 0,
      //   borderTop: '1px',
      //   background: '#000000',
      //   width: '100%',
      //   transform: 'translateY(-50%)',
      // }}
    >
      <ArrowBackIcon />
      {value}px
      <ArrowForwardIcon />
    </Flex>
  );
};

export default Ruler;
