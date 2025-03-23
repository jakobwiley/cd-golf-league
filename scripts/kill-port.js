const { execSync } = require('child_process');

/**
 * Kills any process running on the specified port
 * @param {number} port The port to kill processes on
 */
function killProcessOnPort(port) {
  try {
    console.log(`Checking for processes on port ${port}...`);
    
    // Find process ID using port
    const findCommand = `lsof -i :${port} -t`;
    let pids;
    
    try {
      pids = execSync(findCommand, { encoding: 'utf8' }).trim().split('\n');
    } catch (error) {
      // If no process is found, lsof will exit with code 1
      console.log(`No process found running on port ${port}`);
      return;
    }
    
    if (!pids || pids.length === 0 || (pids.length === 1 && !pids[0])) {
      console.log(`No process found running on port ${port}`);
      return;
    }
    
    // Kill each process
    pids.forEach(pid => {
      if (pid) {
        console.log(`Killing process ${pid} on port ${port}`);
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
          console.log(`Successfully killed process ${pid}`);
        } catch (killError) {
          console.error(`Failed to kill process ${pid}:`, killError.message);
        }
      }
    });
    
    console.log(`All processes on port ${port} have been terminated`);
  } catch (error) {
    console.error(`Error while killing process on port ${port}:`, error.message);
  }
}

// Kill processes on port 3007 (the development server port)
killProcessOnPort(3007);
