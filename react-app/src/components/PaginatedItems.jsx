import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiPlus } from "react-icons/hi";

const PaginatedItems = ({
  items = [],
  renderItem,
  onAdd,
  onDelete,
  isReadOnly = false,
  loading = false,
  emptyMessage = "No hay elementos registrados",
  addingText = "Agregando...",
  addText = "Agregar",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [adding, setAdding] = useState(false);

  // Reset to first item when items change
  useEffect(() => {
    if (items.length > 0 && currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setAnimationClass("slide-out-right");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setAnimationClass("slide-in-left");
        setTimeout(() => setAnimationClass(""), 300);
      }, 150);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setAnimationClass("slide-out-left");
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setAnimationClass("slide-in-right");
        setTimeout(() => setAnimationClass(""), 300);
      }, 150);
    }
  };

  const handleAdd = async () => {
    if (onAdd) {
      setAdding(true);
      try {
        await onAdd();
      } finally {
        setAdding(false);
      }
    }
  };

  const handleItemDelete = (deletedId) => {
    // Handle animation for delete
    setAnimationClass("fade-out");
    setTimeout(() => {
      if (onDelete) {
        onDelete(deletedId);
      }
      // Adjust current index if needed
      if (currentIndex >= items.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      setAnimationClass("fade-in");
      setTimeout(() => setAnimationClass(""), 300);
    }, 200);
  };

  if (loading) {
    return (
      <div className={`paginated-items ${className}`}>
        <div className="paginated-loading">Cargando...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`paginated-items ${className}`}>
        <div className="paginated-header">
          {!isReadOnly && (
            <button
              className="paginated-add-btn"
              onClick={handleAdd}
              disabled={adding}
            >
              <HiPlus />
              {adding ? addingText : addText}
            </button>
          )}
        </div>
        <div className="paginated-empty-state">
          {isReadOnly
            ? emptyMessage.replace("No tienes", "No hay")
            : emptyMessage}
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className={`paginated-items ${className}`}>
      <div className="paginated-header">
        <div className="paginated-navigation">
          <button
            className="paginated-nav-btn"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <HiChevronLeft />
          </button>
          <span className="paginated-counter">
            {currentIndex + 1} de {items.length}
          </span>
          <button
            className="paginated-nav-btn"
            onClick={handleNext}
            disabled={currentIndex === items.length - 1}
          >
            <HiChevronRight />
          </button>
        </div>
        {!isReadOnly && (
          <button
            className="paginated-add-btn"
            onClick={handleAdd}
            disabled={adding}
          >
            <HiPlus />
            {adding ? addingText : addText}
          </button>
        )}
      </div>

      <div className={`paginated-content ${animationClass}`}>
        {renderItem(currentItem, handleItemDelete)}
      </div>

      {items.length > 1 && (
        <div className="paginated-dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`paginated-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => {
                if (index !== currentIndex) {
                  const direction = index > currentIndex ? "left" : "right";
                  setAnimationClass(
                    `slide-out-${direction === "left" ? "left" : "right"}`,
                  );
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setAnimationClass(
                      `slide-in-${direction === "left" ? "right" : "left"}`,
                    );
                    setTimeout(() => setAnimationClass(""), 300);
                  }, 150);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginatedItems;
