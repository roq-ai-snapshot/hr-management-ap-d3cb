import queryString from 'query-string';
import { HrInterface, HrGetQueryInterface } from 'interfaces/hr';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getHrs = async (query: HrGetQueryInterface = {}): Promise<PaginatedInterface<HrInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'hr');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/hr/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/hr/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createHr = async (hr: HrInterface) => {
  return fetcher('/api/model/hr', { method: 'POST', body: JSON.stringify({ data: hr }) });
};

export const updateHrById = async (id: string, hr: HrInterface) => {
  return fetcher('/api/model/hr/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: hr,
    }),
  });
};

export const getHrById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/hr/findFirst',
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

export const deleteHrById = async (id: string) => {
  return fetcher(
    '/api/model/hr/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
