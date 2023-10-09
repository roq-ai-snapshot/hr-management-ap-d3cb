import queryString from 'query-string';
import { EmployeeInterface, EmployeeGetQueryInterface } from 'interfaces/employee';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getEmployees = async (
  query: EmployeeGetQueryInterface = {},
): Promise<PaginatedInterface<EmployeeInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'employee');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/employee/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/employee/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createEmployee = async (employee: EmployeeInterface) => {
  return fetcher('/api/model/employee', { method: 'POST', body: JSON.stringify({ data: employee }) });
};

export const updateEmployeeById = async (id: string, employee: EmployeeInterface) => {
  return fetcher('/api/model/employee/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: employee,
    }),
  });
};

export const getEmployeeById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/employee/findFirst',
    {},
    {
      where: {
        id,
      },
      include: relations.reduce((acc, el) => ({ ...acc, [el.split('.')[0]]: true }), {}),
    },
  );
  return response.data;
};

export const deleteEmployeeById = async (id: string) => {
  return fetcher(
    '/api/model/employee/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
