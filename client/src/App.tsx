import React, { useState, useEffect } from "react";
import { Vote, Users, Award, TrendingUp, CheckCircle } from "lucide-react";
import { ethers, BrowserProvider } from "ethers";
import { contractabi, contractaddress } from "./constant.ts";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Candidate {
  candidatename: string;
  image: string;
  votes: number;
}

function App() {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const [votingcontract, setvotingcontract] = useState<ethers.Contract | null>(
    null
  );

  useEffect(() => {
    if (votingcontract) {
      console.log("Contract is ready, now fetching candidates...");

      
     console.log('Contract has methods:', votingcontract.interface.fragments.map(f => f.name));


      getcandidatesfromchain();
      Getvotingstatus();
    }
  }, [votingcontract]);

  const handleVote = async (indexofcandidate: number) => {
    if (votedFor !== null) return;
    if (!votingcontract) return;

    setVotedFor(indexofcandidate);
    await votingcontract.castvote(indexofcandidate);
    getcandidatesfromchain();
    setShowResults(true);

    // Trigger results animation
    setTimeout(() => {
      setAnimateResults(true);
    }, 500);
  };

  const getcandidatesfromchain = async () => {
    if (!votingcontract) return;

    console.log("Fetching candidates from contract...");
   const rawCandidates = await votingcontract.getAllVotesOfCandidates();
console.log("Raw candidates:", rawCandidates);

// Destructure tuple
const [names, images, votes] = rawCandidates;

const formattedCandidates = names.map((_: string, i: number) => ({
  candidatename: names[i],
  image: images[i],
  votes: Number(votes[i]),
}));

console.log("Formatted candidates:", formattedCandidates);
setCandidates(formattedCandidates);

const total = formattedCandidates.reduce((acc, curr) => acc + curr.votes, 0);
setTotalVotes(total);

  };

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const getLeadingCandidate = () => {
    return candidates.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  const Getremainingtime = async () => {
    if (!votingcontract) return;
    const remainingtime = await votingcontract.getremainingtime();
    setRemainingtime(remainingtime);
  };

  const Getvotingstatus = async () => {
    if (!votingcontract) return;
    const Votingstat = await votingcontract.getvotingstatus();
    setvotingstat(Votingstat);
  };

  const [Remainingtime, setRemainingtime] = useState<number | null>(null);
  const [votingstat, setvotingstat] = useState<boolean | null>(false);
  const [IsConnected, setIsConnected] = useState<boolean | null>(false);
  const [Account, setAccount] = useState<string | null>(null);
  const [provider, setprovider] = useState<ethers.BrowserProvider | null>(null);

  const [signer, setsigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAddress = accounts[0];
      setAccount(newAddress);
      console.log("Account changed to:", newAddress);

      const provider = new ethers.BrowserProvider(window.ethereum);
      setprovider(provider);
      const signer = await provider.getSigner();
      setsigner(signer);
    } else {
      // User disconnected MetaMask
      setAccount(null);
      setIsConnected(false);
    }
  };

  async function connecttometamask() {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      setprovider(provider);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      setsigner(signer);

      const Address = await signer.getAddress();
      setAccount(Address);
      console.log("Metamask Connected: " + Address);
      setIsConnected(true);
      console.log(contractabi);
      const VotingContract = new ethers.Contract(
        contractaddress,
        contractabi,
        signer
      );
      setvotingcontract(VotingContract);
      console.log("Connected to contract:", VotingContract.target);
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          <div className="animate-fade-in-up">
            <Vote className="w-16 h-16 mx-auto mb-6 text-purple-400 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              DemocracyChain
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your voice matters. Cast your vote in this decentralized election
              and help shape the future of our community.
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Secure Voting</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Transparent Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}

      {IsConnected ? (
        <main className="container mx-auto px-6 py-12 flex-grow">
          {/* Voting Status */}
          {votedFor && (
            <div className="mb-12 text-center animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full border border-green-500/30">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Vote Cast Successfully!</span>
              </div>
            </div>
          )}

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {candidates?.map((candidate, index) => (
              <div
                key={index}
                className={`group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 animate-fade-in-up ${
                  votedFor === index
                    ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Candidate Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={candidate.image}
                    alt={candidate.candidatename}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Candidate Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-6 text-center text-white group-hover:text-purple-400 transition-colors">
                    {candidate.candidatename}
                  </h3>

                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(index)}
                    disabled={votedFor !== null}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      votedFor === index
                        ? "bg-green-600 text-white cursor-default"
                        : votedFor !== null
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
                    }`}
                  >
                    {votedFor === index ? (
                      <span className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Voted</span>
                      </span>
                    ) : votedFor !== null ? (
                      "Voting Closed"
                    ) : (
                      "Vote Now"
                    )}
                  </button>

                  {/* Vote Count */}
                  {showResults && (
                    <div className="mt-4 animate-fade-in-up">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Votes</span>
                        <span className="text-sm font-semibold text-purple-400">
                          {candidate.votes} (
                          {getVotePercentage(candidate.votes)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                            animateResults
                              ? "bg-gradient-to-r from-purple-500 to-blue-500"
                              : "bg-gray-700"
                          }`}
                          style={{
                            width: animateResults
                              ? `${getVotePercentage(candidate.votes)}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 animate-fade-in-up">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Live Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {totalVotes}
                  </div>
                  <div className="text-gray-400">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {candidates.length}
                  </div>
                  <div className="text-gray-400">Candidates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {totalVotes > 0
                      ? `${getVotePercentage(getLeadingCandidate().votes)}%`
                      : "0%"}
                  </div>
                  <div className="text-gray-400">Leading</div>
                </div>
              </div>

              {totalVotes > 0 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">
                    Current Leader
                  </h3>
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-8 py-4 rounded-xl border border-purple-500/30">
                    <img
                      src={getLeadingCandidate().image}
                      alt={getLeadingCandidate().candidatename}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="text-left">
                      <div className="font-bold text-xl text-white">
                        {getLeadingCandidate().candidatename}
                      </div>
                      <div className="text-sm text-gray-400">
                        {getLeadingCandidate().votes} votes
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      ) : (
        <div className="flex justify-center items-center py-20 flex-grow">
          <button
            onClick={connecttometamask}
            className="px-8 py-4 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-600/40 transition-all duration-300 active:scale-95"
          >
            Connect to MetaMask
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8 text-center text-gray-400">
          <p>
            &copy; 2024 DemocracyChain. Empowering voices through decentralized
            voting.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
