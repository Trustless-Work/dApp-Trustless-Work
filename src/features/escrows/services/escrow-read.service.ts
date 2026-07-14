import type { EscrowRestService } from "@trustless-work/escrow";
import type { EscrowListFilters } from "@/features/escrows/types/escrow.types";
import {
  mapEscrowDetailToModel,
  mapEscrowSummaryToListItem,
} from "@/features/escrows/utils/escrow-rest-map.helper";
import { toRestListParams } from "@/features/escrows/utils/escrow-list-params.helper";
import type { KeysetPage } from "@/types/pagination.entity";
import type {
  EscrowDetailModel,
  EscrowListItem,
} from "@/features/escrows/types/escrow.types";

export type EscrowReadServices = {
  rest: EscrowRestService;
};

export function createEscrowReadService(services: EscrowReadServices) {
  return {
    async listPage(
      filters: EscrowListFilters,
      options?: { cursor?: string; limit?: number },
    ): Promise<KeysetPage<EscrowListItem>> {
      const page = await services.rest.listEscrows(
        toRestListParams(filters, options),
      );

      return {
        data: page.data
          .map((row) => mapEscrowSummaryToListItem(row))
          .filter((item): item is EscrowListItem => item !== null),
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
      };
    },

    async getByContractId(
      contractId: string,
    ): Promise<EscrowDetailModel | null> {
      const resolvedContractId = contractId.trim();
      if (!resolvedContractId) {
        return null;
      }

      const detail = await services.rest.getEscrow(resolvedContractId);
      return mapEscrowDetailToModel(detail);
    },
  };
}

export type EscrowReadService = ReturnType<typeof createEscrowReadService>;
