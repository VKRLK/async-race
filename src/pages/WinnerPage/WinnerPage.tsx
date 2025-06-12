// src/pages/WinnerPage/WinnerPage.tsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { fetchWinners } from '../../store/winners/actions';
import type { WinnerType } from '../../store/winners/types';
import Button from '../../components/Button/Button';
import styles from './WinnerPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { CARS_PER_PAGE } from '../../utils/constants';

const WinnerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const winners = useSelector((state: RootState) => state.winners.winnerList);
  const loading = useSelector((state: RootState) => state.winners.loading);
  const error = useSelector((state: RootState) => state.winners.error);
  const page = useSelector((state: RootState) => state.garage.currentPage);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchWinners({ page, limit: CARS_PER_PAGE }));
  }, [dispatch]);

  if (loading) return <p>Loading winners...</p>;
  if (error) return <p>Error loading winners: {error}</p>;

  return (
    <div>
      <h1>Winners</h1>
      <Button
        text={'Garage'}
        onClick={() => navigate('/garage')}
        className={styles.button}
        hideTextOnMobile={false}
      />

      {winners.length === 0 ? (
        <p>No winners yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Wins</th>
              <th>Best Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner: WinnerType) => (
              <tr key={winner.id}>
                <td>{winner.id}</td>
                <td>{winner.wins}</td>
                <td>{(winner.time / 1000).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WinnerPage;
