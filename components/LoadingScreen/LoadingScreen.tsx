import React from 'react';

type LoadingScreenProps = {
  something: string;
  other?: number;
};

export const LoadingScreen = (props: LoadingScreenProps) => {
  const { something } = props;

  return <div>{something}</div>;
};
