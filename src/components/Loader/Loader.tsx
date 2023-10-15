import { RotateLoader } from 'react-spinners';

export const Loader = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%)',
      }}
    >
      <RotateLoader size={15} color="#D63636" />
    </div>
  </>
);
