// src/pages/GaragePage.tsx

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCars } from '../../store/garage/actions';
import { selectCars, selectCurrentPage, selectTotalCars } from '../../store/garage/selectors';
import { CARS_PER_PAGE } from '../../utils/constants';
import { setCurrentPage } from '../../store/garage/reducer';

import RaceControlPanel from '../../components/RaceControlPanel/RaceControlPanel';
import CarTrack from '../../components/CarTrack/CarTrack';
import CarEditor from '../../components/CarEditor/CarEditor';
import Button from '../../components/Button/Button';
import styles from './GaragePage.module.scss';

export function GaragePage() {
  const dispatch = useAppDispatch();
  const cars = useAppSelector(selectCars);
  const total = useAppSelector(selectTotalCars);
  const page = useAppSelector(selectCurrentPage);
  const location = useLocation();
  const navigate = useNavigate();

  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(800);

  useEffect(() => {
    const el = trackContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setTrackWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCars({ page }));
  }, [dispatch, location, page]);

  return (
    <div>
      <h1>Garage</h1>
      <Button
        text={'Winners'}
        onClick={() => navigate('/winners')}
        className={styles.button}
        hideTextOnMobile={false}
      />
      <RaceControlPanel paginatedCars={cars} trackWidth={trackWidth} />

      <CarEditor mode="create" />

      <div style={{ marginBottom: '1rem' }}>
        <button disabled={page === 1} onClick={() => dispatch(setCurrentPage(page - 1))}>
          Prev
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button
          disabled={page * CARS_PER_PAGE >= total}
          onClick={() => dispatch(setCurrentPage(page + 1))}
        >
          Next
        </button>
      </div>

      <div ref={trackContainerRef} className={styles.trackContainer}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cars.map(car => (
            <CarTrack key={car.id} car={car} trackWidth={trackWidth} />
          ))}
        </ul>
      </div>
    </div>
  );
}
