import React, { useContext } from 'react';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import TaskList from './components/Task/TaskList';
import AuthScreen from './components/Auth/AuthScreen';

const MainApp = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Avoid flicker

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <TaskList />
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
