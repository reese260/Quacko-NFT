// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

contract QuackoNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint64 public _totalSupply = 6;
    bool public _mintLive = false;
    uint64 public _totalMinted = 0;
    uint64 public _maxMintsPerUser = 2;

    mapping(address => uint64) _userMinted;

    constructor(
        address initialOwner
    ) ERC721("Quacko", "QUACKO") Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    modifier mintLive(bool live) {
        require(live, "Minting is not live");
        _;
    }

    function safeMint(address to, uint64 quantity) public mintLive(_mintLive) {
        require(quantity > 0, "Quantity cannot be zero");
        require(
            _totalMinted + quantity <= _totalSupply,
            "Exceeds total supply"
        );
        require(
            _userMinted[to] + quantity <= _maxMintsPerUser,
            "Exceeds your minting limit"
        );

        for (uint64 i = 0; i < quantity; i++) {
            _safeMint(to, _nextTokenId);
            _totalMinted++;
            _userMinted[to]++;
            _nextTokenId++;
        }
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmX2ZjSUY34otGTSdnZUcTi2o8D6SEKjuFGK3vypxM8mx7/";
    }

    function tokenURI(
        uint256 tokenId
    ) public pure override returns (string memory) {
        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    function setMintLive() public onlyOwner {
        _mintLive = !_mintLive;
    }

    function getTotalSupply() public view returns (uint64) {
        return _totalSupply;
    }

    function getTotalMinted() public view returns (uint64) {
        return _totalMinted;
    }

    function isMintLive() public view returns (bool) {
        return _mintLive;
    }
}
