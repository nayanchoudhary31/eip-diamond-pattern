// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IDiamondCut {
    enum FacetCutAction{
        Add,
        Replace,
        Remove
    }

    // Created DS to Store Facets Info
    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }

    function diamondCut(
        FacetCut[] calldata _facetCut,
        address _init,
        bytes calldata _calldata
    ) external;

    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);
}
