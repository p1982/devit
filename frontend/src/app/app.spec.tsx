import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import App from './app';
import resultsReducer from './resultsSlice';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { results: resultsReducer },
    });
    mockedAxios.post.mockClear();
  });

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  it('renders correctly with initial state', () => {
    renderApp();
    expect(screen.getByText('Клієнт‑серверний тест запитів')).toBeTruthy();
    expect(screen.getByLabelText(/Ліміт/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Start/i })).toBeTruthy();
    expect(screen.getByText(/Список поки порожній/i)).toBeTruthy();
  });

  it('shows error if input is out of bounds (negative)', () => {
    renderApp();
    const input = screen.getByLabelText(/Ліміт/i);
    const button = screen.getByRole('button', { name: /Start/i });

    fireEvent.change(input, { target: { value: '-5' } });
    fireEvent.click(button);

    expect(screen.getByText('Будь ласка, введіть число від 1 до 100.')).toBeTruthy();
  });

  it('shows error if input is out of bounds (over 100)', () => {
    renderApp();
    const input = screen.getByLabelText(/Ліміт/i);
    const button = screen.getByRole('button', { name: /Start/i });

    fireEvent.change(input, { target: { value: '101' } });
    fireEvent.click(button);

    expect(screen.getByText('Будь ласка, введіть число від 1 до 100.')).toBeTruthy();
  });

  it('disables button after valid submit and sends request', async () => {
    mockedAxios.post.mockResolvedValue({ status: 201, data: { index: 1 } });
    
    renderApp();
    const input = screen.getByLabelText(/Ліміт/i);
    const button = screen.getByRole('button', { name: /Start/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(button);

    expect(button).toHaveProperty('disabled', true);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
