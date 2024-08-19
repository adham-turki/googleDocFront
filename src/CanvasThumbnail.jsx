import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import thumbnail from './Thumpnail.png'; // Adjust the path as per your project structure

function CanvasThumbnail({ content, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Arrow function to strip HTML tags
    const stripHtml = (html) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || '';
    };

    // Clean the content
    const cleanContent = stripHtml(content);
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Load and draw the image
      const image = new Image();
      image.src = thumbnail;
  
      image.onload = () => {
        console.log('Image loaded successfully');
        ctx.drawImage(image, 0, 0, width, height);
  
        // Set text properties for the overlay
        ctx.font = ' 4px sans-serif ';
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // White text with some transparency
        ctx.textAlign = 'left'; // Align text to the left
        ctx.textBaseline = 'top'; // Align text to the top  
        // Split content into lines
        const lines = cleanContent.split('\n');
        
        const lineHeight = 10; // Line height in pixels
        const x =0;
        let y = 20; 
  
        // Log the drawing positions for text
        console.log('Drawing text at positions:', x, y);
  
        // Draw each line of text
        lines.forEach((line) => {
          ctx.fillText(line, x, y);
          y += lineHeight;
        });
      };
  
      image.onerror = () => {
        console.error('Image failed to load. Please check the path:', image.src);
      };
    }
  }, [content, width, height]);
  

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-t-lg"
    />
  );
}

CanvasThumbnail.propTypes = {
  content: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default CanvasThumbnail;
