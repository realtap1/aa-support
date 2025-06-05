"use client";

import { useState, useEffect } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { tokenFactoryContract } from "@/utils/thirdweb/contracts";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import ConnectEcho from "./ConnectEcho";
import { useQuery } from "@apollo/client";
import { GET_TOKEN_CREATED } from "@/lib/queries";

interface TokenDetails {
  name: string;
  symbol: string;
  logoUrl: string;
  description: string;
  totalSupply: string;
  tokenAddress?: string;
}

const TokenCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [formData, setFormData] = useState<TokenDetails>({
    name: "",
    symbol: "",
    logoUrl: "",
    description: "",
    totalSupply: "",
  });

  const { mutate: sendTransaction } = useSendTransaction();
  const activeAccount = useActiveAccount();

  const { refetch: refetchTokenCreated } = useQuery(GET_TOKEN_CREATED, {
    variables: { 
      creator: activeAccount?.address,
      createdAfter: "0" // This will be updated when we have the timestamp
    },
    skip: true, // Skip initial query since we don't have the timestamp yet
  });

  useEffect(() => {
    console.log("Active account status:", activeAccount ? "Connected" : "Not connected");
    if (activeAccount) {
      console.log("Connected address:", activeAccount.address);
    }
  }, [activeAccount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== Token Creation Process Started ===");
    console.log("Form Data:", formData);
    
    if (!activeAccount) {
      console.log("❌ No active account found");
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    console.log("✅ Active account:", activeAccount.address);

    setIsLoading(true);
    console.log("🔄 Loading state set to true");
    
    try {
      console.log("📝 Converting total supply to BigInt");
      const totalSupplyBigInt = BigInt(parseFloat(formData.totalSupply) * 1e18);
      console.log("Total supply in BigInt:", totalSupplyBigInt.toString());
      
      console.log("📝 Preparing contract call...");
      const transaction = await prepareContractCall({
        contract: tokenFactoryContract,
        method: "createToken",
        params: [
          formData.name,
          formData.symbol,
          formData.logoUrl,
          formData.description,
          totalSupplyBigInt,
        ],
        value: 10000000000000000000n,
      });
      console.log("✅ Contract call prepared:", transaction);

      console.log("📝 Sending transaction...");
      await sendTransaction(transaction as any, {
        onSuccess: async (receipt) => {
          console.log("✅ Transaction successful!");
          console.log("Transaction receipt:", receipt);
          
          try {
            console.log("📝 Getting current timestamp");
            const currentTimestamp = Math.floor(Date.now() / 1000);
            console.log("Current timestamp:", currentTimestamp);
            
            console.log("⏳ Waiting for subgraph indexing...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const timeWindow = 300;
            console.log("📝 Fetching token from subgraph...");
            console.log("Query parameters:", {
              creator: activeAccount?.address,
              createdAfter: (currentTimestamp - timeWindow).toString()
            });
            
            const { data } = await refetchTokenCreated({
              creator: activeAccount?.address,
              createdAfter: (currentTimestamp - timeWindow).toString()
            });
            
            console.log("Subgraph response:", data);
            console.log("Raw subgraph response:", JSON.stringify(data, null, 2));
            const newToken = data?.tokenCreateds[0];
            console.log("Found token:", newToken);
            
            if (newToken?.tokenAddress) {
              console.log("✅ Token address found:", newToken.tokenAddress);
              setTokenDetails({
                ...formData,
                tokenAddress: newToken.tokenAddress,
              });
              
              toast({
                title: "Success",
                description: "Token created successfully",
              });
            } else {
              console.log("⚠️ Token address not found in subgraph response");
              console.log("Full subgraph response:", data);
              toast({
                title: "Warning",
                description: "Token created but address not found yet. Please refresh the page in a few moments.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            console.error("❌ Error fetching token:", error);
            console.error("Error details:", {
              message: error.message,
              stack: error.stack
            });
            toast({
              title: "Warning",
              description: "Token created but address not found yet. Please refresh the page in a few moments.",
              variant: "destructive",
            });
          } finally {
            console.log("🔄 Setting loading state to false");
            setIsLoading(false);
          }
        },
        onError: (error: any) => {
          console.error("❌ Transaction error:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack
          });
          toast({
            title: "Error",
            description: "Failed to create token",
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    } catch (error: any) {
      console.error("❌ Error in try block:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      toast({
        title: "Error",
        description: "Failed to prepare transaction",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (tokenDetails?.tokenAddress) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl px-2 py-6">
          <div className="w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8">
            <h2 className="text-2xl font-semibold mb-6">Token Created Successfully!</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400">Name</h3>
                <p className="text-xl">{tokenDetails.name}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Symbol</h3>
                <p className="text-xl">{tokenDetails.symbol}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Logo URL</h3>
                <p className="text-xl break-all">{tokenDetails.logoUrl}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Description</h3>
                <p className="text-xl">{tokenDetails.description}</p>
              </div>
              <div>
                <h3 className="text-gray-400">Token Address</h3>
                <a 
                  href={`https://testnet.ogpuscan.io/token/${tokenDetails.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl break-all font-mono text-blue-400 hover:text-blue-300 hover:underline"
                >
                  {tokenDetails.tokenAddress}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl px-2 py-6">
        <div className="w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-8">
          <h1 className="text-2xl font-semibold mb-6">Create New Token</h1>
          
          {!activeAccount ? (
            <div className="mb-6 p-4 bg-yellow-800/50 rounded-lg">
              <p className="text-yellow-200 mb-4">
                Please connect your wallet to create a token
              </p>
              <div className="flex justify-center">
                <ConnectEcho />
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">
                Creation Fee: <span className="text-white">10 OGPU</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Connected as: {activeAccount.address}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Token Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-400 mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-400 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-400 mb-2">
                Total Supply
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="totalSupply"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !activeAccount}
              className="w-full py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!activeAccount ? (
                "Connect Wallet to Continue"
              ) : isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Token...
                </div>
              ) : (
                "Deploy Token"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;