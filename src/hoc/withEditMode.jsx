import React, { useState } from 'react';

const withEditMode = (WrappedComponent) => {
  return (props) => {
    const [isEditMode, setEditMode] = useState(false);

    return (
      <WrappedComponent
        {...props}
        isEditMode={isEditMode}
        setEditMode={setEditMode}
      />
    );
  };
};

export default withEditMode;
