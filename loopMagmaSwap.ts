import { swapAllMagma } from './magmaStable';

// Loop configuration interface
interface LoopConfig {
  interval: number;      // Interval time (milliseconds)
  maxIterations?: number; // Maximum iterations (optional, infinite loop if not set)
  delayStart?: number;   // Startup delay (milliseconds)
}

// Loop execution of swapAllMagma
async function loopSwapAllMagma(config: LoopConfig): Promise<void> {
  const { interval, maxIterations, delayStart = 0 } = config;

  console.log(`=== Starting loop execution of swapAllMagma ===`);
  console.log(`Configuration: ${interval}ms interval, ${maxIterations ? `maximum ${maxIterations} iterations` : 'infinite loop'}`);

  if (delayStart > 0) {
    console.log(`Starting after ${delayStart}ms delay...`);
    await new Promise(resolve => setTimeout(resolve, delayStart));
  }

  let iteration = 0;

  while (maxIterations === undefined || iteration < maxIterations) {
    iteration++;
    const startTime = Date.now();

    console.log(`\n--- Execution ${iteration} ---`);
    console.log(`Start time: ${new Date().toLocaleString()}`);

    try {
      await swapAllMagma();
      console.log(`✅ Execution ${iteration} successful`);
    } catch (error) {
      console.error(`❌ Execution ${iteration} failed:`, error);
    }

    const executionTime = Date.now() - startTime;
    console.log(`Execution time: ${executionTime}ms`);

    // If not the last execution, wait for the interval
    if (maxIterations === undefined || iteration < maxIterations) {
      const waitTime = Math.max(0, interval - executionTime);
      console.log(`Waiting ${waitTime}ms for next execution...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  console.log(`\n=== Loop execution completed ===`);
  console.log(`Total executions: ${iteration}`);
}

// Graceful shutdown handling
let isStopping = false;

function setupGracefulShutdown(): void {
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT signal, gracefully stopping...');
    isStopping = true;
  });

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM signal, gracefully stopping...');
    isStopping = true;
  });
}

// Main function
async function main() {
  // Configure loop parameters
  const config: LoopConfig = {
    interval: 5000,        // 5 second interval
    maxIterations: 100,     // Execute 100 times
    delayStart: 1000,      // Start after 1 second
  };

  // Setup graceful shutdown
  setupGracefulShutdown();

  try {
    await loopSwapAllMagma(config);
  } catch (error) {
    console.error('Loop execution failed:', error);
    process.exit(1);
  }
}

// If this file is run directly
if (import.meta.main) {
  main().catch(console.error);
}

// Export functions for use by other modules
export { loopSwapAllMagma, type LoopConfig };