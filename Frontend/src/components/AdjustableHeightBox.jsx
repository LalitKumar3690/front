import React, { useState } from 'react';

function AdjustableHeightBox() {
  // State to store the height of the box
  const [height, setHeight] = useState(100);
  const [isResizing, setIsResizing] = useState(false);

  // Function to handle the mouse move event
  const handleMouseMove = (e) => {
    if (isResizing) {
      const newHeight = e.clientY - e.target.getBoundingClientRect().top;
      setHeight(newHeight >= 50 ? newHeight : 50); // Minimum height is 50px
    }
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Attach mouseup and mousemove events when resizing starts
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
     document.addEventListener('mouseup', handleMouseUp); 
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex flex-col items-center p-4">
      {/* Adjustable box */}
      <div
        className="w-64 bg-blue-500 rounded-md overflow-hidden relative"
        style={{ height: `${height}px` }}
      >
        <p className="text-center text-white p-2">Adjustable Height Box</p>

        {/* Drag handle at the bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 cursor-row-resize"
          onMouseDown={() => setIsResizing(true)}
        />
      </div>

      <p className="mt-2 text-sm text-gray-700">Height: {height}px</p>
    </div>
  );
}

export default AdjustableHeightBox;
