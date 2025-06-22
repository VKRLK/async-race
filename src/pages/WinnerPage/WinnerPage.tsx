// src/pages/WinnerPage/WinnerPage.tsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../store';

import { fetchWinners } from '../../store/winners/actions';
import { setCurrentPage } from '../../store/garage/reducer';
import type { WinnerDisplay } from '../../store/winners/actions';

import Button from '../../components/Button/Button';
import styles from './WinnerPage.module.scss';
import type { WinnerType } from '../../store/winners/types';
import { WINNERS_PER_PAGE } from '../../utils/constants';

const WinnerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const winners = useSelector((state: RootState) => state.winners.winnerList);
  const loading = useSelector((state: RootState) => state.winners.loading);
  const error = useSelector((state: RootState) => state.winners.error);
  const page = useSelector((state: RootState) => state.garage.currentPage);
  const [sortField, setSortField] = useState<keyof WinnerType>('wins');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
    dispatch(fetchWinners({ page, limit: WINNERS_PER_PAGE, sort: sortField, order: sortOrder }));
  }, [dispatch, page, sortField, sortOrder]);

  const handlePrev = () => {
    if (page > 1) dispatch(setCurrentPage(page - 1));
  };

  const handleNext = () => {
    if (winners.length === WINNERS_PER_PAGE) {
      dispatch(setCurrentPage(page + 1));
    }
  };

  const handleSort = (field: 'wins' | 'time') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (loading) return <p>Loading winners...</p>;
  if (error) return <p>Error loading winners: {error}</p>;

  return (
    <div className={styles.winnerPage}>
      <h1>Winners</h1>
      <Button text="Garage" onClick={() => navigate('/garage')} className={styles.navButton} />

      {winners.length === 0 ? (
        <p>No winners yet.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Car</th>
                <th>Name</th>
                <th onClick={() => handleSort('wins')} style={{ cursor: 'pointer' }}>
                  Wins {sortField === 'wins' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('time')} style={{ cursor: 'pointer' }}>
                  Best Time (s) {sortField === 'time' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner: WinnerDisplay, index: number) => (
                <tr key={winner.id}>
                  <td>{(page - 1) * WINNERS_PER_PAGE + index + 1}</td>
                  <td>
                    <div
                      style={{
                        width: '30px',
                        height: '16px',
                        backgroundColor: winner.color,
                        borderRadius: '4px',
                        margin: '0 auto',
                      }}
                    />
                  </td>
                  <td>{winner.name}</td>
                  <td>{winner.wins}</td>
                  <td>{winner.time >= 999999 ? '—' : (winner.time / 1000).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={page === 1}>
              Prev
            </button>
            <span>Page {page}</span>
            <button onClick={handleNext} disabled={winners.length < WINNERS_PER_PAGE}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WinnerPage;
