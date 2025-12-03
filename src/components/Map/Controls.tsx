import '../../assets/styles/components/Map/_Controls.scss';


type ControlsProps = {
  onLogout: () => void;
  onReset: () => void;
};

export default function Controls({ onLogout, onReset }: ControlsProps) {
  return (
    <div className="controls">
      <button
        className="controls__button controls__button--logout"
        onClick={onLogout}
      >
        Выйти
      </button>

      <button
        className="controls__button controls__button--reset"
        onClick={onReset}
      >
        Сбросить изменения
      </button>
    </div>
  );
}