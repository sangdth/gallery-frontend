import React, { useState } from 'react';
import {
  IconButton,
  InputGroup,
  Input as ChakraInput,
  InputRightElement,
  InputProps,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export type Props = InputProps & {
  size?: Pick<InputProps, 'size'>;
  type?: string;
};

export const Input = (props: Props) => {
  const {
    size = 'md',
    type = 'text',
    ...restProps
  } = props;

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  if (type === 'password') {
    return (
      <InputGroup size={size}>
        <ChakraInput
          pr="3rem"
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          {...restProps}
        />
        <InputRightElement width="3rem">
          <IconButton
            h="1.75rem"
            size="sm"
            icon={show ? <ViewIcon /> : <ViewOffIcon />}
            aria-label={show ? 'Show' : 'Hide'}
            onClick={handleClick}
          />
        </InputRightElement>
      </InputGroup>
    );
  }

  return (
    <ChakraInput
      size={size}
      type={type}
      {...restProps}
    />
  );
};

export default Input;
