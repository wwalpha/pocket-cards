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
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    Task {
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
    }
}

extension DailyReviewView: DailyReviewDisplayLogic {
    func showNext(model: DailyStudyViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }

        viewModel.question = model.question
    }
}

extension DailyReviewView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = DailyReviewInteractor(subject: subject)
        let presenter = DailyReviewPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct DailyReviewView_Previews: PreviewProvider {
    static var previews: some View {
        DailyReviewView()
    }
}
