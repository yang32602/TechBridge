// Shared utility functions for consistent avatar styling across components

export const getInitials = (name) => {
  if (!name) return "U";
  const cleanName = name.replace(/^(Estudiante|Empresa)$/i, "Usuario");
  return cleanName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Generate consistent avatar color based on name
export const getAvatarColor = (name) => {
  const colors = [
    "#0a5cb8", // Project blue (primary)
    "#1e40af", // Blue 700
    "#059669", // Emerald 600
    "#dc2626", // Red 600
    "#7c3aed", // Violet 600
    "#ea580c", // Orange 600
    "#0891b2", // Cyan 600
    "#65a30d", // Lime 600
  ];

  const index = name?.length ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

// Standard avatar styles for consistency
export const getAvatarStyles = (name, size = 48) => {
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${getAvatarColor(name)}, ${adjustColor(getAvatarColor(name), -20)})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: size > 48 ? "16px" : "14px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  };
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Standard company avatar styles (slight variation)
export const getCompanyAvatarStyles = (name, size = 48, rounded = 8) => {
  return {
    width: size,
    height: size,
    borderRadius: rounded,
    background: `linear-gradient(135deg, ${getAvatarColor(name)}, ${adjustColor(getAvatarColor(name), -20)})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: size > 100 ? "48px" : size > 48 ? "18px" : "16px",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };
};
