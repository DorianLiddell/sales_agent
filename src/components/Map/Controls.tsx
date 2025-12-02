export default function Controls({ onLogout, onReset }: { 
  onLogout: () => void;
  onReset: () => void;
}) {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10, zIndex: 10,
      background: 'rgba(255,255,255,0.9)', padding: 10, borderRadius: 8
    }}>
      <button onClick={onLogout} style={{ marginRight: 10 }}>
        Выйти
      </button>
      <button onClick={onReset}>
        Сбросить изменения
      </button>
      <p style={{ margin: '10px 0 0', fontSize: 12 }}>
        Клик по карте — добавить точку<br/>
        Перетаскивание круга — переместить
      </p>
    </div>
  );
}