const config = {
  branches: [{ name: "main" }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ,
    "@semantic-release/github",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],

    [
      "@semantic-release/git",
      {
        message:
          "chore(release):${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        assets: ["CHANGELOG.md"],
      },
    ],
<<<<<<< HEAD
=======
    [
      "@semantic-release/exec",
      {
        successCmd: `

        docker tag wing09/hanapbh-client:latest wing09/hanapbh-client:\${nextRelease.version}
        docker push wing09/hanapbh-client:\${nextRelease.version}

        docker tag wing09/hanapbh-server:latest wing09/hanapbh-client:\${nextRelease.version}
        docker push wing09/hanapbh-server:\${nextRelease.version}

        
        
    
      `,
      },
    ],
    "@semantic-release/github",
>>>>>>> 8f7b9ce (test)
  ],
};

module.exports = config;
