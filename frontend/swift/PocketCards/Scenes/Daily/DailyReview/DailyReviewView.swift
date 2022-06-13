//
//  DailyReviewView.swift
//  PocketCards
//
//  Created by macmini on 2022/06/12.
//
//

import SwiftUI

struct DailyReviewView: View {
    var interactor: DailyReviewBusinessLogic?

    @ObservedObject var viewModel = DailyReviewViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading....")
                    .onAppear {
                        Task {
                            interactor?.clear()
                            await interactor?.loadQuestions()
                        }
                    }
            } else if viewModel.isFinish {
                Text("今日の学習は終わりました")
                    .font(.system(size: 64, design: .default))
            } else {
                if viewModel.question?.choices != nil {
                    ChoiceQuestion(
                        question: viewModel.question!,
                        isShowError: "",
                        onChoice: interactor!.onChoice
                    )
                } else {
                    // Society or Science
                    FlashCard(question: viewModel.question!, action: interactor!.onAction)
                }
            }
        }.onDisappear {
            viewModel.isLoading = true
            viewModel.isFinish = false
        }
    }
}

extension DailyReviewView: DailyReviewDisplayLogic {
    func showNext(model: DailyStudyViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
        }

        viewModel.question = model.question
    }
}

extension DailyReviewView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = DailyReviewInteractor(subject: subject, loadUrl: URLs.STUDY_DAILY_REVIEW)
        let presenter = DailyReviewPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.isLoading = true

        return view
    }
}

struct DailyReviewView_Previews: PreviewProvider {
    static var previews: some View {
        DailyReviewView()
    }
}
