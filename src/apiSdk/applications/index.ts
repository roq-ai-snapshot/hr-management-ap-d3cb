import queryString from 'query-string';
import { ApplicationInterface, ApplicationGetQueryInterface } from 'interfaces/application';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getApplications = async (
  query: ApplicationGetQueryInterface = {},
): Promise<PaginatedInterface<ApplicationInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'application');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/application/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/application/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createApplication = async (application: ApplicationInterface) => {
  return fetcher('/api/model/application', { method: 'POST', body: JSON.stringify({ data: application }) });
};

export const updateApplicationById = async (id: string, application: ApplicationInterface) => {
  return fetcher('/api/model/application/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: application,
    }),
  });
};

export const getApplicationById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/application/findFirst',
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

export const deleteApplicationById = async (id: string) => {
  return fetcher(
    '/api/model/application/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
