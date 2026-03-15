import axios from 'axios';
import { FormEvent, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { addResult, finish, start } from './resultsSlice';

export function App() {
  const dispatch = useAppDispatch();
  const { results, isRunning } = useAppSelector((state) => state.results);
  const [limitInput, setLimitInput] = useState('10');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setError(null);

      const limit = Number(limitInput);
      if (!Number.isFinite(limit) || limit <= 0 || limit > 100) {
        setError('Будь ласка, введіть число від 1 до 100.');
        return;
      }

      dispatch(start(limit));

      const totalRequests = 1000;
      const indices = Array.from({ length: totalRequests }, (_, i) => i + 1);
      let inFlight = 0;
      let sentThisSecond = 0;
      let completed = 0;
      let queueIndex = 0;
      let cancelled = false;

      const resetSecondInterval = setInterval(() => {
        sentThisSecond = 0;
        if (!cancelled) {
          void sendNext();
        }
      }, 1000);

      const sendNext = async () => {
        if (cancelled) {
          return;
        }

        while (
          inFlight < limit &&
          sentThisSecond < limit &&
          queueIndex < indices.length
        ) {
          const currentIndex = indices[queueIndex];
          queueIndex += 1;
          inFlight += 1;
          sentThisSecond += 1;

          axios
            .post('/api', { index: currentIndex })
            .then((response) => {
              console.log('API Response:', response.data);
              if (response.status === 200 || response.status === 201) {
                if (typeof response.data?.index === 'number') {
                  dispatch(addResult(response.data.index));
                } else {
                  console.warn('Response data index is not a number:', response.data);
                }
              }
            })
            .catch((err) => {
              console.error('API Error:', err.response?.data || err.message);
            })
            .finally(() => {
              inFlight -= 1;
              completed += 1;

              if (completed === totalRequests) {
                clearInterval(resetSecondInterval);
                dispatch(finish());
              } else {
                void sendNext();
              }
            });
        }
      };

      void sendNext();

      return () => {
        cancelled = true;
        clearInterval(resetSecondInterval);
      };
    },
    [dispatch, limitInput],
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top, #0f172a 0, #020617 45%, #020617 100%)',
        color: '#e5e7eb',
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          backgroundColor: 'rgba(15,23,42,0.9)',
          borderRadius: '1rem',
          boxShadow:
            '0 20px 25px -5px rgba(15,23,42,0.8), 0 8px 10px -6px rgba(15,23,42,0.8)',
          padding: '1.75rem',
          border: '1px solid rgba(148,163,184,0.2)',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            marginBottom: '0.75rem',
            fontWeight: 600,
          }}
        >
          Клієнт‑серверний тест запитів
        </h1>
        <p
          style={{
            marginBottom: '1.5rem',
            color: '#9ca3af',
            fontSize: '0.95rem',
          }}
        >
          Введіть ліміт (одночасні запити і запити за секунду), натисніть
          «Start» – буде надіслано 1000 запитів на `/api`, а відповіді
          відображатимуться одразу.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <label
            htmlFor="limit"
            style={{
              fontSize: '0.9rem',
              color: '#e5e7eb',
            }}
          >
            Ліміт (1–100):
          </label>
          <input
            id="limit"
            type="number"
            min={1}
            max={100}
            required
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            style={{
              width: '6rem',
              padding: '0.4rem 0.6rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(148,163,184,0.6)',
              backgroundColor: '#020617',
              color: '#e5e7eb',
              fontSize: '0.9rem',
            }}
          />
          <button
            type="submit"
            disabled={isRunning}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              background: isRunning
                ? 'rgba(55,65,81,0.7)'
                : 'linear-gradient(90deg,#22c55e,#3b82f6)',
              color: '#0b1120',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: isRunning
                ? 'none'
                : '0 10px 15px -3px rgba(22,163,74,0.5)',
              transition:
                'transform 0.15s ease-out, box-shadow 0.15s ease-out, opacity 0.15s ease-out',
              opacity: isRunning ? 0.6 : 1,
            }}
          >
            {isRunning ? 'Виконується…' : 'Start'}
          </button>

          <div
            style={{
              marginLeft: 'auto',
              fontSize: '0.85rem',
              color: '#9ca3af',
            }}
          >
            Успішних відповідей: {results.length} / 1000
          </div>
        </form>

        {error && (
          <div
            style={{
              marginBottom: '0.75rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(248,113,113,0.6)',
              color: '#fecaca',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: '1rem',
            maxHeight: '320px',
            overflowY: 'auto',
            borderRadius: '0.75rem',
            background:
              'linear-gradient(180deg,rgba(15,23,42,0.9),rgba(15,23,42,0.95))',
            border: '1px solid rgba(31,41,55,1)',
            padding: '0.75rem',
            fontSize: '0.85rem',
          }}
        >
          {results.length === 0 ? (
            <div style={{ color: '#6b7280' }}>
              Список поки порожній — запустіть сценарій, щоб побачити індекси
              відповідей.
            </div>
          ) : (
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '0.4rem',
              }}
            >
              {results.map((idx) => (
                <li
                  key={idx}
                  style={{
                    padding: '0.35rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(15,118,110,0.25)',
                    border: '1px solid rgba(45,212,191,0.5)',
                    textAlign: 'center',
                    color: '#a5f3fc',
                  }}
                >
                  #{idx}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
