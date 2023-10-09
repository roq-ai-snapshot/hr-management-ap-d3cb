import queryString from 'query-string';
import { JobInterface, JobGetQueryInterface } from 'interfaces/job';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getJobs = async (query: JobGetQueryInterface = {}): Promise<PaginatedInterface<JobInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'job');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/job/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/job/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createJob = async (job: JobInterface) => {
  return fetcher('/api/model/job', { method: 'POST', body: JSON.stringify({ data: job }) });
};

export const updateJobById = async (id: string, job: JobInterface) => {
  return fetcher('/api/model/job/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: job,
    }),
  });
};

export const getJobById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/job/findFirst',
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

export const deleteJobById = async (id: string) => {
  return fetcher(
    '/api/model/job/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
