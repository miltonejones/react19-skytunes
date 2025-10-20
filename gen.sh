#!/bin/bash

mkdir src/components/$1
cat > src/components/$1/$1.jsx << EOF
import React from 'react';

const $1 = () => {
  return (
    <div>
      <h1>$1 Component works!</h1>
    </div>
  );
};

export default $1;
EOF