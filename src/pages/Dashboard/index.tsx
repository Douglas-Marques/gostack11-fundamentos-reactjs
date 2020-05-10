/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

const income = require('../../assets/income.svg') as string;
const outcome = require('../../assets/outcome.svg') as string;
const total = require('../../assets/total.svg') as string;

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      api.get('/transactions').then(response => {
        const transactionsFormatted = response.data.transactions.map(
          (transaction: Transaction) => ({
            ...transaction,
            formattedValue: formatValue(transaction.value),
            formattedDate: new Date(transaction.created_at).toLocaleDateString(
              'pt-br',
            ),
          }),
        );
        const balanceFormatted = {
          income: formatValue(response.data.balance.income),
          outcome: formatValue(response.data.balance.outcome),
          total: formatValue(response.data.balance.total),
        };
        setTransactions(transactionsFormatted);
        setBalance(balanceFormatted);
      });
    }
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        {balance && (
          <CardContainer>
            <Card>
              <header>
                <p>Entradas</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">{balance.income}</h1>
            </Card>
            <Card>
              <header>
                <p>Saídas</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">{balance.outcome}</h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">{balance.total}</h1>
            </Card>
          </CardContainer>
        )}

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }
                  >
                    {transaction.type === 'outcome' && ' - '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
