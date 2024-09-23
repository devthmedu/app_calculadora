import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Componente para tela de carregamento
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#ff9500" />
    <Text style={styles.loadingText}>Carregando...</Text>
  </View>
);

const App: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<string>('');
  const [memory, setMemory] = useState<number | null>(null); // Para memória

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNumberInput = (num: number) => {
    if (displayValue === '0') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleOperatorInput = (nextOperator: string) => {
    const currentValue = parseFloat(displayValue);
    if (firstValue === null) {
      setFirstValue(currentValue);
      setHistory(displayValue + ' ' + nextOperator + ' ');
    } else {
      const newValue = evaluate(firstValue, currentValue, operator);
      setDisplayValue(newValue.toString());
      setFirstValue(newValue);
      setHistory(newValue + ' ' + nextOperator + ' ');
    }
    setOperator(nextOperator);
    setDisplayValue('0');
  };

  const handleEqual = () => {
    if (firstValue !== null && operator) {
      const currentValue = parseFloat(displayValue);
      const result = evaluate(firstValue, currentValue, operator);
      setDisplayValue(result.toString());
      setHistory('');
      setFirstValue(null);
      setOperator(null);
    }
  };

  const evaluate = (num1: number, num2: number, operator: string | null) => {
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num1 / num2;
      default: return num2;
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue(null);
    setHistory('');
  };

  const handleDecimal = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(displayValue);
    setDisplayValue((currentValue / 100).toString());
  };

  const handleInvert = () => {
    const currentValue = parseFloat(displayValue);
    setDisplayValue((-currentValue).toString());
  };

  const handleMemorySave = () => {
    setMemory(parseFloat(displayValue));
  };

  const handleMemoryRecall = () => {
    if (memory !== null) {
      setDisplayValue(memory.toString());
    }
  };

  const handleMemoryClear = () => {
    setMemory(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.historyText}>{history}</Text>
        <Text style={styles.displayText}>{displayValue}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {renderButtonRow([7, 8, 9, '/'])}
        {renderButtonRow([4, 5, 6, '*'])}
        {renderButtonRow([1, 2, 3, '-'])}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.zeroButton]} onPress={() => handleNumberInput(0)}>
            <Text style={[styles.buttonText, styles.zeroButtonText]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDecimal}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperatorInput('+')}>
            <Text style={[styles.buttonText, styles.operatorButtonText]}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.memoryButton} onPress={handleMemorySave}>
            <Text style={styles.buttonText}>M+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.memoryButton} onPress={handleMemoryRecall}>
            <Text style={styles.buttonText}>MR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.memoryButton} onPress={handleMemoryClear}>
            <Text style={styles.buttonText}>MC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={handleInvert}>
            <Text style={[styles.buttonText, styles.operatorButtonText]}>±</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.equalButton]} onPress={handleEqual}>
            <Text style={styles.equalButtonText}>=</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePercentage}>
            <Text style={styles.buttonText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>C</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  function renderButtonRow(numbers: (number | string)[]) {
    return (
      <View style={styles.row}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={num === '/' || num === '*' ? [styles.button, styles.operatorButton] : styles.button}
            onPress={() => (isNaN(Number(num)) ? handleOperatorInput(num as string) : handleNumberInput(num as number))}
          >
            <Text style={[styles.buttonText, num === '/' || num === '*' ? styles.operatorButtonText : null]}>
              {isNaN(Number(num)) ? (num === '/' ? '÷' : '×') : num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  historyText: {
    fontSize: 20,
    color: '#336',
  },
  displayText: {
    fontSize: 36,
    color: '#333',
  },
  buttonContainer: {
    flex: 3,
    width: '90%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 3,
    margin: 2,
    padding: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
  zeroButton: {
    flex: 2,
    paddingLeft: 35,
    paddingRight: 35,
  },
  operatorButton: {
    backgroundColor: '#f0f0f0',
  },
  operatorButtonText: {
    color: '#ff9500',
  },
  equalButton: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9500',
    elevation: 3,
  },
  equalButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  clearButton: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 10,
    elevation: 3,
    padding: 10,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#333',
  },
  memoryButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default App;
