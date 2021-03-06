$(document).ready(function() {
  var url = event.path[1].location.origin;
  console.log(url);
  var postsContainer = $("#postsContainer");
  var posts;

  $.get("/api/myposts/", function(data) {
    posts = data;
    if (!posts || !posts.length) {
      console.log("no posts yet");
    } else {
      initializeRows();
    }
  });

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    postsContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      var postAuthor = posts[i].User.first_name + " " + posts[i].User.last_name;
      postsToAdd.push(createNewRow(posts[i], postAuthor));
    }
    console.log(postsToAdd);
    postsContainer.append(postsToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(post, author) {
    console.log(post);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm a");

    //Create variables
    var newPostCard = $("<div>");
    var card = $("<div>");
    var cardHeader = $("<div>");
    var row1 = $("<div>");
    var col12 = $("<div>");
    var colCounter = $("<div>");
    var commentCounter = $("<h6>");
    var span = $("<span>");
    var hr = $("<hr>");
    var row2 = $("<div>");
    var col9 = $("<div>");
    var link = $("<a>");
    var postTitle = $("<h3>");
    var col1 = $("<div>");
    var editButton = $("<button>");
    var deleteButton = $("<button>");
    var col2 = $("<div>");
    var postAuthor = $("<h5>");
    var postDate = $("<p>");
    var cardBody = $("<div>");
    var row3 = $("<div>");
    var col12Body = $("<div>");
    var postBody = $("<h5>");

    // Add classes + ids
    card.addClass("card mb-4");
    cardHeader.addClass("card-header");
    row1.addClass("row");
    col12.addClass("col-lg-10 col-md-9 col-8");
    colCounter.addClass("col-lg-2 col-md-3 col-4");
    commentCounter.addClass("pt-3 comments");
    span.addClass("badge badge-secondary");
    span.attr("id", "post_Category");
    hr.addClass("separator-md");
    row2.addClass("row");
    row2.attr("id", "singlePost");
    col9.addClass("col-lg-7 col-md-5 col-sm-8 col-7 mb-3");
    postTitle.attr("id", "post_Title");
    col1.addClass("col-lg-2 col-sm-4 col-5 col-md-3 buttons-section");
    editButton.addClass("btn btn-default mr-1");
    deleteButton.addClass("btn btn-default");
    editButton.attr("id", "edit-submit");
    deleteButton.attr("id", "edit-submit");
    col2.addClass(
      "col-lg-3 col-md-4 d-none d-sm-none d-md-block author-details"
    );
    col2.attr("id", "user");
    postAuthor.addClass("mt-3");
    postAuthor.attr("id", "post_Author");
    postDate.attr("id", "post_UpdatedAt");
    editButton.attr("value", post.id);
    cardBody.addClass("card-body");
    row3.addClass("row");
    col12Body.addClass("col-lg-12");
    postBody.attr("id", "post_Body");
    deleteButton.addClass("delete");

    //Create badge colors based on category
    if ("Server-Side" === post.category) {
      $(span).addClass("server-side");
    } else if ("Client-Side" === post.category) {
      $(span).addClass("client-side");
    } else if ("Career Advice" === post.category) {
      $(span).addClass("career-advice");
    } else if ("Web Developer's FAQ" === post.category) {
      $(span).addClass("faq");
    } else {
      $(span).addClass("website-management");
    }

    //Insert info from posts
    $(span).addClass("badge");
    span.text(post.category);
    commentCounter.text("Comments: " + post.Comments.length);
    postTitle.text(post.title);
    postAuthor.text(author);
    postDate.text(formattedDate);
    postBody.text(post.body);
    postTitle.attr(post.title);
    deleteButton.text("X");
    editButton.text("Edit");
    deleteButton.attr("id", post.id);

    //Link title of post to unique post page
    var postLink = url + "/posts=" + post.id;
    console.log(postLink);
    $(link).attr("href", postLink);

    $(editButton).attr("onclick", `location.href='/editpost=${post.id}'`);
    $(editButton).attr("type", "submit");
    $(deleteButton).attr("type", "submit");
  
    //Append to page
    col12.append(span);
    row1.append(col12);
    colCounter.append(commentCounter);
    row1.append(colCounter);
    cardHeader.append(row1);
    card.append(cardHeader);
    newPostCard.append(card);

    link.append(postTitle);
    col9.append(link);
    row2.append(col9);

    col2.append(postAuthor);
    col2.append(postDate);
    row2.append(col2);

    col1.append(editButton);
    col1.append(deleteButton);
    row2.append(col1);

    card.append(hr);
    card.append(row2);

    card.append(hr);

    col12Body.append(postBody);
    row3.append(col12Body);
    cardBody.append(row3);
    card.append(cardBody);

    console.log(newPostCard);

    return newPostCard;
  }

  $(document).on("click", ".delete", function () {
    console.log($(this).prop("id"));
    buttonvalue = $(this).prop("id")
    console.log(buttonvalue)
    var newInfo = {
        active: false,
        id: buttonvalue
    };
    console.log(newInfo);
    updatePost(newInfo);
  })

  function updatePost(data) {
    $.ajax({
        method: "PUT",
        url: "/api/posts/" + data.id,
        data: data
    }).then(function() {
        window.location.reload();
    });
  }

});
