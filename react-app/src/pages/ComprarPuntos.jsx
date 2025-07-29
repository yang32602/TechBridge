import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { CompanySidebar } from "../components";
import { HiSparkles, HiStar, HiLightningBolt, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { FaCcPaypal } from "react-icons/fa";
import api from "../services/api";
import "../assets/comprar-puntos.css";

const ComprarPuntos = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); // 'success' or 'error'
  const [companyData, setCompanyData] = useState(null);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      // 等待认证加载完成
      if (authLoading) {
        return;
      }

      if (!user || (user.tipoUsuario !== 'empresa' && user.userType !== 'empresas')) {
        navigate('/login');
        return;
      }

      try {
        // 获取公司数据
        const company = await api.getCompanyByUserId(user.id_empresa || user.id);
        if (company) {
          setCompanyData(company);
          // 获取可购买的 techpoints
          const techPointsData = await api.getTechPoints();
          setPackages(techPointsData);

          // 获取当前公司的 techpoints ���量
          const balance = await api.getCompanyTechPoints(company.id);
          setUserBalance(balance);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, authLoading]);

  // 检测支付状态
  useEffect(() => {
    const checkPaymentStatus = () => {
      const urlParams = new URLSearchParams(location.search);
      const paymentId = urlParams.get('paymentId');
      const payerId = urlParams.get('PayerID');
      const token = urlParams.get('token');
      const paymentStatus = urlParams.get('payment');

      // 如果有这些参数，说明是从 PayPal 返回的
      if (paymentId || payerId || token || paymentStatus) {
        // 检查是否有成功的支付参数
        if (paymentId && payerId && token && payerId === 'success') {
          // 支付成功
          setNotificationType('success');
          setShowNotification(true);
          // 重新加载余额
          if (companyData) {
            api.getCompanyTechPoints(companyData.id)
              .then(balance => setUserBalance(balance))
              .catch(console.error);
          }
        } else if (paymentStatus === 'cancelled' || paymentStatus === 'failed') {
          // 支付取消或失败
          setNotificationType('error');
          setShowNotification(true);
        }

        // 清理 URL 参数
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // 3秒后自动关闭通知
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    };

    checkPaymentStatus();
  }, [location.search, companyData]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !companyData) {
      alert("Por favor selecciona un paquete primero");
      return;
    }

    try {
      const response = await api.createPaymentOrder(
        companyData.id,
        selectedPackage.id
      );

      if (response && response.links) {
        const approveLink = response.links.find(link => link.rel === 'approve');
        if (approveLink) {
          window.location.href = approveLink.href;
        } else {
          alert('Error: No se pudo obtener el enlace de pago');
        }
      } else {
        alert('Error: Respuesta de pago inválida');
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
      alert('Error al crear la orden de pago. Inténtalo de nuevo.');
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  if (authLoading || loading) {
    return (
      <div className="comprar-puntos-container">
        <CompanySidebar activeSection="comprar-puntos" />
        <div className="comprar-puntos-main">
          <div className="loading-container">
            <HiSparkles className="loading-icon" />
            <p>{authLoading ? 'Verificando autenticación...' : 'Cargando paquetes...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comprar-puntos-container">
      <CompanySidebar activeSection="comprar-puntos" />

      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <div className="notification-content">
            {notificationType === 'success' ? (
              <>
                <HiCheckCircle className="notification-icon" />
                <span>✅ ¡Pago realizado con éxito!</span>
              </>
            ) : (
              <>
                <HiXCircle className="notification-icon" />
                <span>❌ El pago fue cancelado.</span>
              </>
            )}
            <button className="notification-close" onClick={closeNotification}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="comprar-puntos-main">
        {/* Header */}
        <div className="comprar-puntos-header">
          <div className="balance-display">
            <HiSparkles className="balance-icon" />
            <span>Balance Actual: {userBalance.toLocaleString()} TechPoints</span>
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
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-card ${selectedPackage?.id === pkg.id ? "selected" : ""}`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {/* Coin Icon */}
                <div className="coin-icon">
                  <div className="coin-image">
                    <HiSparkles />
                  </div>
                </div>

                {/* Package Content */}
                <div className="package-content">
                  <div className="price">${pkg.precio}</div>
                  <div className="coins-amount">
                    <span className="coins-number">
                      {pkg.puntos?.toLocaleString() || 0}
                    </span>
                    <span className="coins-text">TechPoints</span>
                  </div>
                  {pkg.descripcion && <div className="bonus-text">{pkg.descripcion}</div>}
                </div>

                {/* Glow Effect */}
                <div className="package-glow"></div>
              </div>
            ))
          ) : (
            <div className="no-packages">
              <p>No hay paquetes disponibles en este momento.</p>
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <div className="purchase-section">
          <button
            className={`purchase-btn ${selectedPackage ? "active" : ""}`}
            onClick={handlePurchase}
            disabled={!selectedPackage}
          >
            {selectedPackage
              ? `Comprar por $${selectedPackage.precio}`
              : "Selecciona un Paquete"}
          </button>

          <div className="payment-methods">
            <span>Métodos de pago disponibles:</span>
            <div className="payment-icons">
              <FaCcPaypal  className="payment-icon"/>       
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprarPuntos;
