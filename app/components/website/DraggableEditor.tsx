import React, { useState, useRef, useEffect } from 'react';

type ComponentType = 'CARD' | 'BANNER';

interface DraggableComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
}

const DraggableItem = ({
  component,
  moveComponent,
  isSelected,
  onSelect,
  onDeselect,
}: {
  component: DraggableComponent;
  moveComponent: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDeselect: () => void;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      onDeselect();
    } else {
      onSelect(component.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = itemRef.current!.getBoundingClientRect();
    
    setIsDragging(true);
    setDragStartPosition({ x: startX, y: startY });
    setDragOffset({ x: startX - rect.left, y: startY - rect.top });

    // Disable text selection during dragging
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartPosition.x;
    const dy = e.clientY - dragStartPosition.y;

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      moveComponent(component.id, component.x + dx, component.y + dy);
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = 'auto'; // Restore text selection
    }
  };

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, dragStartPosition]);

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        width: `${component.width}px`,
        height: `${component.height}px`,
        backgroundColor: component.type === 'CARD' ? 'lightblue' : 'lightgreen',
        border: '1px solid #ccc',
        cursor: 'move',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        boxShadow: isSelected ? '0px 0px 10px rgba(0, 0, 255, 0.5)' : 'none',
        transform: `translate3d(${component.x + dragOffset.x}px, ${component.y + dragOffset.y}px, 0)`, // Using translate3d for GPU acceleration
        willChange: 'transform', // Hint to the browser that this element will move
      }}
    >
      {component.type === 'CARD' ? 'Card Component' : 'Banner Component'}
    </div>
  );
};

const EditorCanvas = () => {
  const [components, setComponents] = useState<DraggableComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const moveComponent = (id: string, x: number, y: number) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, x, y } : comp))
    );
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDeselect = () => {
    setSelectedId(null);
  };

  const addComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    const newComponent: DraggableComponent = {
      id: newId,
      type,
      x: 50,
      y: 50,
      width: 150,
      height: 100,
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
      onClick={() => {
        if (selectedId) {
          handleDeselect();
        }
      }}
    >
      {components.map((component) => (
        <DraggableItem
          key={component.id}
          component={component}
          moveComponent={moveComponent}
          isSelected={component.id === selectedId}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      ))}

      <button
        onClick={() => addComponent('CARD')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Add Card
      </button>

      <button
        onClick={() => addComponent('BANNER')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '120px',
          padding: '10px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Add Banner
      </button>
    </div>
  );
};

export default function DraggableEditor() {
  return <EditorCanvas />;
}
