// src/pages/WinnerPage/WinnerPage.tsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../store';
import { fetchWinners } from '../../store/winners/actions';
import { setCurrentPage } from '../../store/garage/reducer';
import type { WinnerType } from '../../store/winners/types';

import Button from '../../components/Button/Button';
import styles from './WinnerPage.module.scss';
import { CARS_PER_PAGE } from '../../utils/constants';

const WinnerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const winners = useSelector((state: RootState) => state.winners.winnerList);
  const loading = useSelector((state: RootState) => state.winners.loading);
  const error = useSelector((state: RootState) => state.winners.error);
  const page = useSelector((state: RootState) => state.garage.currentPage);

  useEffect(() => {
    const savedPage = Number(localStorage.getItem('winnersCurrentPage'));
    if (!isNaN(savedPage) && savedPage > 0) {
      dispatch(setCurrentPage(savedPage));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('winnersCurrentPage', String(page));
  }, [page]);

  useEffect(() => {
    dispatch(fetchWinners({ page, limit: CARS_PER_PAGE }));
  }, [dispatch, page]);

  const handlePrev = () => {
    if (page > 1) dispatch(setCurrentPage(page - 1));
  };

  const handleNext = () => {
    if (winners.length === CARS_PER_PAGE) {
      dispatch(setCurrentPage(page + 1));
    }
  };

  if (loading) return <p>Loading winners...</p>;
  if (error) return <p>Error loading winners: {error}</p>;

  return (
    <div className={styles.winnerPage}>
      <h1>Winners</h1>
      <Button
        text="Garage"
        onClick={() => navigate('/garage')}
        className={styles.navButton}
        hideTextOnMobile={false}
      />

      {winners.length === 0 ? (
        <p>No winners yet.</p>
      ) : (
        <>
          <table className={styles.table}>
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

          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span>Page {page}</span>
            <button onClick={handleNext} disabled={winners.length < CARS_PER_PAGE}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WinnerPage;
