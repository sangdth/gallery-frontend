import React from 'react';
import { Flex } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

type RulerProps = {
  value: number;
};

const Ruler = (props: RulerProps) => {
  const { value } = props;
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="#EFEFEF"
      marginTop="10px"
      marginBottom="10px"
    >
      <ArrowBackIcon />
      {value}px
      <ArrowForwardIcon />
    </Flex>
  );
};

export default Ruler;
