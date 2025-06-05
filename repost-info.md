// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/extension/Upgradeable.sol";
import "@thirdweb-dev/contracts/extension/Initializable.sol";

contract PostRegistry is Upgradeable, Initializable {
    struct Post {
        uint256 id;
        address author;
        string text;        
        string fileCid;     
        uint256 createdAt;
        uint256 parentId;
        bool deleted;
        uint256 likeCount;
    }

    struct Repost {
        uint256 id;
        address reposter;
        uint256 originalPostId;
        uint256 createdAt;
        bool deleted;
    }

    uint256 public nextPostId;
    uint256 public nextRepostId;
    address public deployer;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => Repost) public reposts;
    mapping(uint256 => mapping(address => bool)) private likes;

    // Events
    event PostCreated(
        uint256 indexed postId,
        address indexed author,
        string text,
        string fileCid,
        uint256 parentId
    );
    event PostDeleted(uint256 indexed postId);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostReposted(uint256 indexed repostId, uint256 indexed originalPostId, address indexed reposter);

    function initialize() public initializer {
        nextPostId = 1;
        nextRepostId = 1;
        deployer = msg.sender;
    }

    function createPost(
        string calldata text,
        string calldata fileCid,
        uint256 parentId
    ) external {
        uint256 postId = nextPostId++;
        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            text: text,
            fileCid: fileCid,
            createdAt: block.timestamp,
            parentId: parentId,
            deleted: false,
            likeCount: 0
        });
        emit PostCreated(postId, msg.sender, text, fileCid, parentId);
    }

    function deletePost(uint256 postId) external {
        Post storage p = posts[postId];
        require(p.author == msg.sender, "Not the author");
        require(!p.deleted, "Already deleted");
        p.deleted = true;
        emit PostDeleted(postId);
    }

    function likePost(uint256 postId) external {
        Post storage p = posts[postId];
        require(!p.deleted, "Post deleted");
        require(!likes[postId][msg.sender], "Already liked");
        likes[postId][msg.sender] = true;
        p.likeCount++;
        emit PostLiked(postId, msg.sender);
    }


    function hasLiked(uint256 postId, address user) external view returns (bool) {
        return likes[postId][user];
    }

    function getPost(uint256 postId) external view returns (
        uint256 id,
        address author,
        string memory text,
        string memory fileCid,
        uint256 createdAt,
        uint256 parentId,
        bool deleted,
        uint256 likeCount
    ) {
        Post storage p = posts[postId];
        return (
            p.id,
            p.author,
            p.text,
            p.fileCid,
            p.createdAt,
            p.parentId,
            p.deleted,
            p.likeCount
        );
    }

    function repostPost(uint256 originalPostId) external {
        require(posts[originalPostId].author != address(0), "No such post");
        require(!posts[originalPostId].deleted, "Original post deleted");
        
        uint256 repostId = nextRepostId++;
        reposts[repostId] = Repost({
            id: repostId,
            reposter: msg.sender,
            originalPostId: originalPostId,
            createdAt: block.timestamp,
            deleted: false
        });
        
        emit PostReposted(repostId, originalPostId, msg.sender);
    }

    function deleteRepost(uint256 repostId) external {
        Repost storage r = reposts[repostId];
        require(r.reposter == msg.sender, "Not the reposter");
        require(!r.deleted, "Already deleted");
        r.deleted = true;
        emit PostDeleted(repostId);
    }

    function _authorizeUpgrade(address) internal view override {
        require(msg.sender == deployer, "Not deployer");
    }
}
