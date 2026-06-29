const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const validPackages = ['api', 'component', 'hook', 'page', 'state', 'style', 'auth', 'config', 'middleware', 'utils'];
const logsEndpoint = process.env.REACT_APP_LOGS_ENDPOINT || 'http://4.224.186.213/evaluation-service/logs';

export async function logger(stack, level, logPackage, message) {
  if (stack !== 'frontend') {
    return;
  }

  if (!validLevels.includes(level) || !validPackages.includes(logPackage)) {
    return;
  }

  const token = process.env.REACT_APP_ACCESS_TOKEN;
  if (!token) {
    return;
  }

  try {
    await fetch(logsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: logPackage,
        message
      })
    });
  } catch {
  }
}
