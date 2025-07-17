import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { CompanySidebar } from "../components";
import { HiSparkles, HiStar, HiLightningBolt } from "react-icons/hi";
import "../assets/comprar-puntos.css";

const ComprarPuntos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userBalance] = useState(500); // Current balance - could come from API

  const packages = [
    {
      id: 1,
      price: "$1.99",
      coins: 100,
      bonus: null,
      popular: false,
    },
    {
      id: 2,
      price: "$4.99",
      coins: 300,
      bonus: "+50 Bonus",
      popular: false,
    },
    {
      id: 3,
      price: "$9.99",
      coins: 700,
      bonus: "+150 Bonus",
      popular: false,
    },
    {
      id: 4,
      price: "$19.99",
      coins: 1500,
      bonus: "+400 Bonus",
      popular: true,
      recommended: "Más Popular",
    },
    {
      id: 5,
      price: "$49.99",
      coins: 4000,
      bonus: "+1200 Bonus",
      popular: false,
    },
    {
      id: 6,
      price: "$99.99",
      coins: 8500,
      bonus: "+2800 Bonus",
      popular: false,
      bestValue: "Mejor Valor",
    },
  ];

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = () => {
    if (selectedPackage) {
      // Here you would integrate with payment gateway
      alert(
        `Comprando ${selectedPackage.coins} puntos por ${selectedPackage.price}`,
      );
    } else {
      alert("Por favor selecciona un paquete primero");
    }
  };

  return (
    <div className="comprar-puntos-container">
      <CompanySidebar activeSection="comprar-puntos" />

      <div className="comprar-puntos-main">
        {/* Header */}
        <div className="comprar-puntos-header">
          <div className="balance-display">
            <HiSparkles className="balance-icon" />
            <span>Balance Actual: {userBalance.toLocaleString()} Puntos</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h1 className="main-title">
            <HiLightningBolt className="title-icon" />
            Centro de Recarga
          </h1>
          <p className="subtitle">
            Obtén Puntos para desbloquear funciones premium
          </p>
        </div>

        {/* Packages Grid */}
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${pkg.popular ? "popular" : ""} ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
              onClick={() => handlePackageSelect(pkg)}
            >
              {/* Special Labels */}
              {pkg.recommended && (
                <div className="package-label recommended">
                  <HiStar />
                  {pkg.recommended}
                </div>
              )}
              {pkg.bestValue && (
                <div className="package-label best-value">
                  <HiSparkles />
                  {pkg.bestValue}
                </div>
              )}

              {/* Coin Icon */}
              <div className="coin-icon">
                <div className="coin-image">
                  <HiSparkles />
                </div>
              </div>

              {/* Package Content */}
              <div className="package-content">
                <div className="price">{pkg.price}</div>
                <div className="coins-amount">
                  <span className="coins-number">
                    {pkg.coins.toLocaleString()}
                  </span>
                  <span className="coins-text">Puntos</span>
                </div>
                {pkg.bonus && <div className="bonus-text">{pkg.bonus}</div>}
              </div>

              {/* Glow Effect */}
              <div className="package-glow"></div>
            </div>
          ))}
        </div>

        {/* Purchase Button */}
        <div className="purchase-section">
          <button
            className={`purchase-btn ${selectedPackage ? "active" : ""}`}
            onClick={handlePurchase}
            disabled={!selectedPackage}
          >
            {selectedPackage
              ? `Comprar por ${selectedPackage.price}`
              : "Selecciona un Paquete"}
          </button>

          <div className="payment-methods">
            <span>Métodos de pago disponibles:</span>
            <div className="payment-icons">
              <div className="payment-icon">💳</div>
              <div className="payment-icon">🏦</div>
              <div className="payment-icon">📱</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprarPuntos;
