import React, { useState } from 'react';
import {
  IconButton,
  InputGroup,
  Input,
  InputRightElement,
  InputProps,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export type Props = {
  size?: Pick<InputProps, 'size'>;
} & InputProps;

export const PasswordInput = (props: Props) => {
  const {
    size = 'md',
    ...restProps
  } = props;

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  return (
    <InputGroup size={size}>
      <Input
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
};

export default PasswordInput;
