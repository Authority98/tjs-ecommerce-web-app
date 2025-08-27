import React from 'react';

const floatingElements = [
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 0, x: '31%', y: '35%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object1.png', delay: 0.5, x: '75%', y: '9%', size: 183 },
    { image: '/assets/images/Vector-Smart-Object-2.png', delay: 1.5, x: '5%', y: '75%', size: 100 },
    { image: '/assets/images/plush.png', delay: 1.2, x: '80%', y: '45%', size: 63 },
    { image: '/assets/images/Vector-Smart-Object-1ss-1.png', delay: 1.7, x: '40%', y: '80%', size: 54 },
    { image: '/assets/images/Vector-Smart-Object2-1-ss.png', delay: 0.3, x: '15%', y: '16%', size: 81 },
    { image: '/assets/images/sircle2.png', delay: 0.8, x: '75%', y: '67%', size: 66 },
  ]

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden w-full">
      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute transition-all duration-700 ease-in-out z-0 pointer-events-none"
          style={{ 
            left: `clamp(0px, calc(${element.x} - ${element.size/2}px), calc(100vw - ${element.size}px))`, 
            top: element.y,
            transform: element.image.includes('Vector-Smart-Object2-1-ss.png') ? 'rotate(256deg)' : 
                      element.image.includes('Vector-Smart-Object1.png') ? 'rotate(260deg)' : 
                      element.image.includes('plush.png') ? 'rotate(76deg)' : 
                      `rotate(${index * 45}deg)`,
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
        >
          <img 
            src={element.image} 
            alt="Decorative element" 
            style={{ 
              width: `${element.size}px`, 
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%'
            }} 
          />
        </div>
      ))}

      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;